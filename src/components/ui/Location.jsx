import "./Location.css";

export const Location = () => {
  return (
    <section className="location" id="location">
      <div className="container">
        <div className="location-content">
          <div className="location-info">
            <h2 className="location-title common-title">Где нас найти</h2>
            <div className="location-details">
              <div className="location-address">
                <h3>Адрес</h3>
                <p>
                  ул. Гагарина, 40
                  <br />
                  г. Севастополь
                </p>
              </div>
              <div className="location-hours">
                <h3>Часы работы</h3>
                <p>Пн-Вс: 10:00 - 22:00</p>
              </div>
              <div className="location-phone">
                <h3>Телефон</h3>
                <p>+7 (8692) 12-34-56</p>
              </div>
            </div>
          </div>
          <div className="location-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434!2d33.583078!3d44.734314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDQuNzM0MzE0LDMzLjU4MzA3OA!5e0!3m2!1sen!2sru!4v1234567890!5m2!1sen!2sru"
              width="100%"
              height="400"
              style={{ border: 0 }}
              // Разрешает карте открываться в полноэкранном режиме
              allowFullScreen=""
              // Экономит трафик и ускоряет первоначальную загрузку страницы
              loading="lazy"
              // не отправляет URL вашей страницы на Google Maps
              referrerPolicy="no-referrer-when-downgrade"
              title="Карта расположения ресторана Burger Cheddar в Севастополе"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
